# Generated by Django 4.1.7 on 2023-03-29 00:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('structure', '0003_rename_department_id_department_department_number_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='member',
            name='department',
        ),
    ]