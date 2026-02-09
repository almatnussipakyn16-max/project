import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

# Celery Beat schedule
app.conf.beat_schedule = {
    'send-reservation-reminders': {
        'task': 'reservations.tasks.send_reservation_reminders',
        'schedule': crontab(minute='*/30'),  # Every 30 minutes
    },
    'check-low-stock': {
        'task': 'inventory.tasks.check_low_stock_alerts',
        'schedule': crontab(hour=9, minute=0),  # Every day at 9 AM
    },
    'auto-complete-orders': {
        'task': 'orders.tasks.auto_complete_delivered_orders',
        'schedule': crontab(minute='*/15'),  # Every 15 minutes
    },
    'auto-cancel-reservations': {
        'task': 'reservations.tasks.auto_cancel_expired_reservations',
        'schedule': crontab(hour=0, minute=0),  # Every day at midnight
    },
}


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
