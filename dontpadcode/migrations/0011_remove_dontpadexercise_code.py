# Generated by Django 4.1.2 on 2022-12-03 18:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dontpadcode', '0010_dontpadexercise_alter_dontpadusercode_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dontpadexercise',
            name='code',
        ),
    ]
