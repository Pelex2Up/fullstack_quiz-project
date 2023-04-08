from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import QuizModel, QuizQuestions, QuizAnswers


class QuizAnswersInline(admin.StackedInline):
    model = QuizAnswers


class QuizQuestionsInline(admin.StackedInline):
    model = QuizQuestions
    inlines = [QuizAnswersInline]


class QuizModelAdmin(admin.ModelAdmin):
    inlines = [QuizQuestionsInline]
    list_display = ('title', 'user', 'description', 'link')
    search_fields = ('title', 'user__username', 'description')
    readonly_fields = ('link',)
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'user')
        }),
        (_('URL'), {
            'fields': ('link',),
            'classes': ('collapse',)
        }),
    )


admin.site.register(QuizModel, QuizModelAdmin)
admin.site.register(QuizQuestions)
admin.site.register(QuizAnswers)

