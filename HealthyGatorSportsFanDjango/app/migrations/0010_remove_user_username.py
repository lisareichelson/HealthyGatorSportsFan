# Generated by Django 5.1.1 on 2024-11-06 21:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_remove_user_google_acct_id_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='username',
        ),
    ]
