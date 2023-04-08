from django.urls import path, include, re_path
from rest_framework import routers
from . import api
from . import views

app_name = 'quiz_core_app'

router = routers.DefaultRouter()
router.register('quiz/list', api.QuizListViewSet, 'api-quiz-list')
router.register('user/quiz/list', api.UserQuizViewSet, 'api-user-quiz-list')
router.register('quiz/filter/<user_id>', api.QuizGetByUserId, 'api-quiz-filter-userid')
router.register('quiz/questions', api.QuestionsViewSet, 'api-questions')
router.register('quiz/answers', api.AnswersViewSet, 'api-answers')

urlpatterns = [
    path('api/', include(router.urls)),
    path('', views.main_page, name='main-page'),
    path('<slug:link>', views.quiz_page),
    re_path(r'^api/quiz/(?P<link>[\w-]+)/$', api.QuizGetByLink.as_view({'get': 'list'}), name='api_quiz-detail'),
    path('user/login/', views.login_view, name='login'),
    path('user/my_account/', views.my_account_view, name='my_account'),
    path('user/logout/', views.logout_view, name='logout'),
    path('registration/', views.registration, name='registration'),
    path('user/get_user_data/', views.get_user_data, name='get-user-data'),
    path('api/quiz/filter/<int:user_id>/', api.QuizGetByUserId.as_view({'get': 'list'}), name='quiz-filter-user-id'),
    path('create-new-quiz/', views.create_new_quiz, name="quiz-creation-page"),
    path('api/send_tg_data/', api.send_tg_data, name='api-send-tg-data'),
]