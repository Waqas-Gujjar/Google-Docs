# Generated by Django 5.1.5 on 2025-05-13 16:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0002_docuser'),
    ]

    operations = [
        migrations.RenameField(
            model_name='doc',
            old_name='upate_at',
            new_name='updated_at',
        ),
        migrations.RenameField(
            model_name='docuser',
            old_name='update_at',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='docuser',
            old_name='create_at',
            new_name='updated_at',
        ),
    ]
