# Generated by Django 4.1.7 on 2023-03-29 00:10

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('structure', '0003_rename_department_id_department_department_number_and_more'),
        ('reports', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='report',
            name='created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='report',
            name='type',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='report',
            name='member',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.PROTECT, related_name='report_member', to='structure.member'),
        ),
    ]