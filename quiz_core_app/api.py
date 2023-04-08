import json
from django.http import JsonResponse
from rest_framework import viewsets, permissions

from .serializers import QuizSerializer, QuestionsSerializer, AnswersSerializer
from .models import QuizModel, QuizQuestions, QuizAnswers
from .bot_config import bot, admin_chat_id


class QuizListViewSet(viewsets.ModelViewSet):
    queryset = QuizModel.objects.all()
    permission_classes = [
        permissions.AllowAny,
    ]
    serializer_class = QuizSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class QuizGetByLink(viewsets.ModelViewSet):
    queryset = QuizModel.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [
        permissions.AllowAny,
    ]

    def get_serializer_context(self):
        context = super(QuizGetByLink, self).get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = super(QuizGetByLink, self).get_queryset()
        link = self.kwargs['link']
        queryset = queryset.filter(link=link)
        return queryset


class QuizGetByUserId(viewsets.ModelViewSet):
    queryset = QuizModel.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [
        permissions.AllowAny,
    ]

    def get_serializer_context(self):
        context = super(QuizGetByUserId, self).get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = super(QuizGetByUserId, self).get_queryset()
        user_id = self.kwargs['user_id']
        queryset = queryset.filter(user_id=user_id)
        return queryset


class UserQuizViewSet(viewsets.ModelViewSet):
    serializer_class = QuizSerializer
    permission_classes = [
        permissions.AllowAny,
    ]

    def get_queryset(self):
        user = self.request.user
        return QuizModel.objects.filter(user_id=user)


class QuestionsViewSet(viewsets.ModelViewSet):
    queryset = QuizQuestions.objects.all()
    serializer_class = QuestionsSerializer
    permission_classes = [
        permissions.AllowAny,
    ]


class AnswersViewSet(viewsets.ModelViewSet):
    queryset = QuizAnswers.objects.all()
    serializer_class = AnswersSerializer
    permission_classes = [
        permissions.AllowAny,
    ]


def send_tg_data(request):
    data = json.loads(request.body)
    bot.send_message(admin_chat_id, f'Новый пользователь прошел опрос!\n\n'
                                    f'<b>Опрос:</b> {data["quizTitle"]} \n'
                                    f'<b>Имя пользователя:</b> {data["userName"]} \n'
                                    f'<b>E-mail:</b> {data["userEmail"]} \n'
                                    f'<b>Номер телефона:</b> {data["userPhone"]}', parse_mode='HTML')
    return JsonResponse(data)
