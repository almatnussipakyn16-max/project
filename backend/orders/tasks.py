from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


@shared_task
def send_order_confirmation_email(order_id):
    """Send order confirmation email to customer"""
    from orders.models import Order
    
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return
    
    subject = f'Order Confirmation - #{order.order_number}'
    message = f"""
    Dear {order.user.get_full_name()},
    
    Your order has been confirmed!
    
    Order Number: {order.order_number}
    Restaurant: {order.restaurant.name}
    Total: ${order.total}
    
    Estimated delivery time: {order.estimated_delivery_time}
    
    Thank you for your order!
    """
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [order.user.email],
        fail_silently=False,
    )


@shared_task
def send_order_status_update(order_id, new_status):
    """Send email when order status changes"""
    from orders.models import Order
    from django.conf import settings
    
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return
    
    # Only send email for certain status changes that customers care about
    status_messages = {
        'CONFIRMED': 'Your order has been confirmed and will be prepared soon.',
        'PREPARING': 'Your order is being prepared.',
        'READY': 'Your order is ready!',
        'OUT_FOR_DELIVERY': 'Your order is out for delivery.',
        'DELIVERED': 'Your order has been delivered. Enjoy your meal!',
    }
    
    # Skip if status is not in messages (e.g., PENDING, COMPLETED, CANCELLED)
    if new_status not in status_messages:
        return
    
    message_text = status_messages[new_status]
    
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    
    subject = f'Order Update - #{order.order_number}'
    message = f"""
    Dear {order.user.get_full_name()},
    
    {message_text}
    
    Order Number: {order.order_number}
    Restaurant: {order.restaurant.name}
    
    Track your order: {frontend_url}/orders/{order.id}
    """
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [order.user.email],
        fail_silently=False,
    )


@shared_task
def notify_restaurant_new_order(order_id):
    """Notify restaurant owner about new order"""
    from orders.models import Order
    from notifications.models import Notification
    
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return
    
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    
    # Create notification for restaurant owner
    Notification.objects.create(
        user=order.restaurant.owner,
        type='ORDER',
        title='New Order',
        message=f'New order #{order.order_number} - ${order.total}',
        link=f'/dashboard/orders/{order.id}'
    )
    
    # Send email to restaurant
    subject = f'New Order - #{order.order_number}'
    message = f"""
    New order received!
    
    Order Number: {order.order_number}
    Customer: {order.user.get_full_name()}
    Total: ${order.total}
    Type: {order.order_type}
    
    Items:
    {chr(10).join([f'- {item.menu_item.name} x{item.quantity}' for item in order.items.all()])}
    
    View order: {frontend_url}/dashboard/orders/{order.id}
    """
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [order.restaurant.email],
        fail_silently=False,
    )


@shared_task
def handle_order_cancellation(order_id):
    """Handle order cancellation tasks"""
    from orders.models import Order
    from payments.models import Payment
    
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return
    
    # Process refund if payment exists
    try:
        payment = order.payment
        if payment.status == 'SUCCEEDED':
            payment.status = 'REFUNDED'
            payment.save()
            
            # Send refund email
            send_mail(
                f'Order Cancelled - Refund Processed',
                f'Your order #{order.order_number} has been cancelled and refunded.',
                settings.DEFAULT_FROM_EMAIL,
                [order.user.email],
                fail_silently=False,
            )
    except Payment.DoesNotExist:
        pass


@shared_task
def auto_complete_delivered_orders():
    """Automatically complete orders that have been delivered for 1+ hours"""
    from orders.models import Order
    
    cutoff_time = timezone.now() - timedelta(hours=1)
    
    orders_to_complete = Order.objects.filter(
        status='DELIVERED',
        updated_at__lte=cutoff_time
    )
    
    for order in orders_to_complete:
        order.status = 'COMPLETED'
        order.save()
