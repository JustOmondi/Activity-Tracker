# Generated by Django 4.1.7 on 2023-03-28 23:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('structure', '0002_department_created_department_updated_group_created_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='department',
            old_name='department_id',
            new_name='department_number',
        ),
        migrations.RenameField(
            model_name='subgroup',
            old_name='subgroup_id',
            new_name='subgroup_number',
        ),
    ]
