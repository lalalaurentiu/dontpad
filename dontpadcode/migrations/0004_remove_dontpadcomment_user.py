# Generated by Django 4.1.2 on 2022-11-07 12:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dontpadcode', '0003_dontpadcomment'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dontpadcomment',
            name='user',
        ),
    ]
