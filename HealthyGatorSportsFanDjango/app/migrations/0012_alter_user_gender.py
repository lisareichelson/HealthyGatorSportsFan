# Generated by Django 5.1.1 on 2024-11-07 17:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_remove_user_height_user_first_name_user_height_feet_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='gender',
            field=models.CharField(choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], max_length=10),
        ),
    ]