# Generated by Django 5.1.1 on 2024-11-06 19:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_alter_user_birthdate'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='google_acct_id',
        ),
        migrations.AddField(
            model_name='notificationdata',
            name='notification_title',
            field=models.CharField(default='Default Title', max_length=255),
        ),
    ]
