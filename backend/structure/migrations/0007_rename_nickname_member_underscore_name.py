# Generated by Django 4.1.7 on 2023-03-30 15:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('structure', '0004_remove_member_department'),
    ]

    operations = [
        migrations.RenameField(
            model_name='member',
            old_name='nickname',
            new_name='underscore_name',
        ),
    ]
