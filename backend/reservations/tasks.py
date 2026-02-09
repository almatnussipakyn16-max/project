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
    
    now = timezone.now()
    reminder_time = now + timedelta(hours=1)
    
    # Find reservations in the next hour
    upcoming_reservations = Reservation.objects.filter(
        reservation_date=reminder_time.date(),
        reservation_time__gte=reminder_time.time(),
        reservation_time__lte=(reminder_time + timedelta(minutes=30)).time(),
        status='CONFIRMED'
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
