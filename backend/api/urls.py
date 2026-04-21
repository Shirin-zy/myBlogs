from django.urls import path
from .views.base import health_check, test_get
from .views.auth.views import test_login
from .views.article.views import wait_review_article, article_list

urlpatterns = [
    path("health/", health_check, name="health_check"),
    path("test-get/", test_get, name="test_get"),
    path("login/", test_login, name="test_login"),
    path("waitReviewArticle/", wait_review_article, name="wait_review_article"),
    path("blogs/articleList/", article_list, name="article_list"),
]
