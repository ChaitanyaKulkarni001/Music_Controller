# Generated by Django 5.0.4 on 2024-07-05 07:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotify', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='spotifytoken',
            name='refresh_token',
            field=models.CharField(max_length=150, null=True),
        ),
    ]
