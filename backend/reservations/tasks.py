from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


@shared_task
def send_reservation_confirmation(reservation_id):
    """Send reservation confirmation email"""
    from reservations.models import Reservation
    
    try:
        reservation = Reservation.objects.get(id=reservation_id)
    except Reservation.DoesNotExist:
        return
    
    subject = f'Reservation Confirmed - {reservation.restaurant.name}'
    message = f"""
    Dear {reservation.user.get_full_name()},
    
    Your reservation has been confirmed!
    
    Restaurant: {reservation.restaurant.name}
    Date: {reservation.reservation_date}
    Time: {reservation.reservation_time}
    Guests: {reservation.guest_count}
    Table: {reservation.table.table_number if reservation.table else 'TBD'}
    
    We look forward to seeing you!
    
    Restaurant Address: {reservation.restaurant.address}
    Phone: {reservation.restaurant.phone}
    """
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [reservation.user.email],
        fail_silently=False,
    )


@shared_task
def send_reservation_reminder(reservation_id):
    """Send reminder 1 hour before reservation"""
    from reservations.models import Reservation
    
    try:
        reservation = Reservation.objects.get(id=reservation_id)
    except Reservation.DoesNotExist:
        return
    
    subject = f'Reservation Reminder - {reservation.restaurant.name}'
    message = f"""
    Dear {reservation.user.get_full_name()},
    
    This is a reminder for your reservation today!
    
    Restaurant: {reservation.restaurant.name}
    Time: {reservation.reservation_time}
    Guests: {reservation.guest_count}
    
    See you soon!
    """
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [reservation.user.email],
        fail_silently=False,
    )


@shared_task
def send_reservation_reminders():
    """Send reminders for upcoming reservations (runs every 30 min)"""
    from reservations.models import Reservation
    from datetime import datetime, timedelta
    from django.db.models import Q
    
    now = timezone.now()
    reminder_start = now + timedelta(hours=1)
    reminder_end = now + timedelta(hours=1, minutes=30)
    
    # Find reservations in the next hour (between 1 hour and 1.5 hours from now)
    # Use proper datetime comparison to handle midnight crossing
    upcoming_reservations = Reservation.objects.filter(
        status='CONFIRMED'
    ).filter(
        # Filter for reservations on the start date or later
        Q(reservation_date__gt=reminder_start.date()) |
        Q(reservation_date=reminder_start.date(), reservation_time__gte=reminder_start.time())
    ).filter(
        # And before the end time
        Q(reservation_date__lt=reminder_end.date()) |
        Q(reservation_date=reminder_end.date(), reservation_time__lte=reminder_end.time())
    )
    
    for reservation in upcoming_reservations:
        send_reservation_reminder.delay(reservation.id)


@shared_task
def auto_cancel_expired_reservations():
    """Auto-cancel reservations that weren't confirmed"""
    from reservations.models import Reservation
    
    cutoff_time = timezone.now() - timedelta(hours=24)
    
    expired_reservations = Reservation.objects.filter(
        status='PENDING',
        created_at__lte=cutoff_time
    )
    
    for reservation in expired_reservations:
        reservation.status = 'CANCELLED'
        reservation.save()
