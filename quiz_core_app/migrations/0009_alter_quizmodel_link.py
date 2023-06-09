# Generated by Django 4.1.7 on 2023-03-27 10:59

import django.core.validators
from django.db import migrations, models
import re


class Migration(migrations.Migration):

    dependencies = [
        ('quiz_core_app', '0008_alter_quizmodel_link'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quizmodel',
            name='link',
            field=models.SlugField(editable=False, unique=True, validators=[django.core.validators.RegexValidator(re.compile('^[-a-zA-Z0-9_]+\\Z'), 'Enter a valid “slug” consisting of letters, numbers, underscores or hyphens.', 'invalid')], verbose_name='URL'),
        ),
    ]
