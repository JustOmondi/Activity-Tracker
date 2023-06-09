# Generated by Django 4.1.7 on 2023-04-25 23:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('structure', '0010_delete_group'),
        ('reports', '0011_alter_report_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='report',
            name='day',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='report',
            name='name',
            field=models.CharField(blank=True, choices=[('lesson', 'Lesson'), ('activity', 'Activity'), ('homework', 'Homework'), ('weekly_meeting', 'Weekly meeting')], max_length=50, null=True),
        ),
        migrations.AlterUniqueTogether(
            name='report',
            unique_together={('name', 'member', 'day')},
        ),
    ]
