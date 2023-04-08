# Generated by Django 4.1.7 on 2023-03-27 10:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('quiz_core_app', '0005_quizanswers_answer'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='quizmodel',
            options={'verbose_name_plural': 'Квизы'},
        ),
        migrations.AlterModelOptions(
            name='quizquestions',
            options={'verbose_name_plural': 'Вопросы'},
        ),
        migrations.AlterField(
            model_name='quizanswers',
            name='answer',
            field=models.CharField(default=None, max_length=200, verbose_name='Ответ'),
        ),
        migrations.AlterField(
            model_name='quizanswers',
            name='is_correct',
            field=models.BooleanField(default=False, verbose_name='Верно/не верно'),
        ),
        migrations.AlterField(
            model_name='quizanswers',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='quiz_core_app.quizquestions', verbose_name='Вопрос'),
        ),
        migrations.AlterField(
            model_name='quizmodel',
            name='link',
            field=models.SlugField(max_length=150, unique=True, verbose_name='Ссылка'),
        ),
        migrations.AlterField(
            model_name='quizmodel',
            name='title',
            field=models.CharField(max_length=200, verbose_name='Заголовок'),
        ),
        migrations.AlterField(
            model_name='quizmodel',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь'),
        ),
        migrations.AlterField(
            model_name='quizquestions',
            name='question',
            field=models.CharField(default=None, max_length=200, verbose_name='Вопрос'),
        ),
        migrations.AlterField(
            model_name='quizquestions',
            name='quiz',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='quiz_core_app.quizmodel', verbose_name='Квиз'),
        ),
    ]