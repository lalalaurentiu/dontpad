# Generated by Django 4.1 on 2022-10-14 15:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DontpadURL',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField()),
            ],
        ),
        migrations.CreateModel(
            name='DontpadCode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.TextField()),
                ('slug', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='url', to='dontpadcode.dontpadurl')),
            ],
        ),
    ]
