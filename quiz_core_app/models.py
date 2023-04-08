import random

from django.core.validators import validate_slug
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from transliterate import translit


class QuizModel(models.Model):
    title = models.CharField(max_length=50, verbose_name='Заголовок')
    link = models.SlugField(unique=True, editable=False, validators=[validate_slug], verbose_name="URL")
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="Пользователь")
    description = models.CharField(max_length=120, default=None, verbose_name='Краткое описание квиза')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = 'Квизы'

    def save(self, *args, **kwargs):
        if not self.link:
            self.link = slugify(translit((str(self.title) + '-' + str(random.randint(1, 999))),
                                         'ru', reversed=True))
            return super().save(*args, **kwargs)


class QuizQuestions(models.Model):
    question = models.CharField(max_length=200, default=None, verbose_name="Вопрос")
    quiz = models.ForeignKey(QuizModel, on_delete=models.CASCADE, related_name='questions', verbose_name="Квиз")

    def __str__(self):
        return self.question

    class Meta:
        verbose_name_plural = 'Вопросы'


class QuizAnswers(models.Model):
    answer = models.CharField(max_length=200, default=None, verbose_name="Ответ")
    is_correct = models.BooleanField(default=False, verbose_name="Верно/не верно")
    question_id = models.ForeignKey(QuizQuestions, on_delete=models.CASCADE, related_name='answers', verbose_name="Вопрос")

    def __str__(self):
        return self.answer
