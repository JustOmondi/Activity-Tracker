# Generated by Django 4.1.7 on 2023-03-29 22:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0005_alter_report_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='report',
            name='name',
            field=models.CharField(blank=True, choices=[('lesson', 'Lesson'), ('acitivty', 'Acitivty'), ('homework', 'Homework'), ('weekly_meeting', 'weekly_meeting')], max_length=50, null=True),
        ),
    ]
