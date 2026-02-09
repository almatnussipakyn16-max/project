from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User


class Ticket(models.Model):
    """Support ticket model."""
    
    class Status(models.TextChoices):
        OPEN = 'OPEN', _('Open')
        IN_PROGRESS = 'IN_PROGRESS', _('In Progress')
        WAITING = 'WAITING', _('Waiting on Customer')
        RESOLVED = 'RESOLVED', _('Resolved')
        CLOSED = 'CLOSED', _('Closed')
    
    class Priority(models.TextChoices):
        LOW = 'LOW', _('Low')
        MEDIUM = 'MEDIUM', _('Medium')
        HIGH = 'HIGH', _('High')
        URGENT = 'URGENT', _('Urgent')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='support_tickets')
    ticket_number = models.CharField(_('ticket number'), max_length=50, unique=True)
    subject = models.CharField(_('subject'), max_length=255)
    description = models.TextField(_('description'))
    status = models.CharField(_('status'), max_length=20, choices=Status.choices, default=Status.OPEN)
    priority = models.CharField(_('priority'), max_length=20, choices=Priority.choices, default=Priority.MEDIUM)
    
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    resolved_at = models.DateTimeField(_('resolved at'), blank=True, null=True)
    
    class Meta:
        verbose_name = _('ticket')
        verbose_name_plural = _('tickets')
        db_table = 'support_tickets'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'Ticket #{self.ticket_number} - {self.subject}'
