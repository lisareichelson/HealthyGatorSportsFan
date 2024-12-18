# Generated by Django 5.1.1 on 2024-11-06 23:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_remove_user_username'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='height',
        ),
        migrations.AddField(
            model_name='user',
            name='first_name',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='user',
            name='height_feet',
            field=models.CharField(default='', max_length=10),
        ),
        migrations.AddField(
            model_name='user',
            name='height_inches',
            field=models.CharField(default='', max_length=10),
        ),
        migrations.AddField(
            model_name='user',
            name='last_name',
            field=models.CharField(default='', max_length=100),
        ),
    ]
