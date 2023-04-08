from rest_framework import serializers
from .models import QuizModel, QuizQuestions, QuizAnswers


class AnswersSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuizAnswers
        fields = '__all__'


class QuestionsSerializer(serializers.ModelSerializer):
    answers = AnswersSerializer(many=True, read_only=True)
    quiz_id = serializers.IntegerField()

    class Meta:
        model = QuizQuestions
        fields = ('id', 'quiz_id', 'question', 'answers')


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionsSerializer(many=True, read_only=True)

    class Meta:
        model = QuizModel
        fields = '__all__'


