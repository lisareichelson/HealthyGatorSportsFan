# Generated by Django 5.1.1 on 2024-10-10 21:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='goal_weight',
            field=models.DecimalField(decimal_places=1, max_digits=4),
        ),
    ]
