from django.urls import path
from .views.base import health_check, test_get
from .views.auth.views import login, logout
from .views.article.views import wait_review_article, article_list
from .views.llmApi.views import chat


urlpatterns = [
    path("health", health_check, name="health_check"),
    path("test-get", test_get, name="test_get"),
    path("login", login, name="login"),
    path("logout", logout, name="logout"),
    path("waitReviewArticle", wait_review_article, name="wait_review_article"),
    path("blogs/articleList", article_list, name="article_list"),
    path("llmApi/chat", chat, name="chat"),
]
