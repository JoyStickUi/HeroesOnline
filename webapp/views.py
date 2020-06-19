from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.db.models import Q

from .models import Friendship
from game.models import Figure, FigureLink
from .models import Money
from .forms import AuthUserForm, RegisterUserForm


# Create your views here.


def index(request):
    return render(request, "index.html")


def client(request):
    if request.user.is_authenticated:
        return render(request, "GameClient.html")
    else:
        return redirect("index")


class MLoginView(LoginView):
    template_name = "login.html"
    form_class = AuthUserForm
    success_url = reverse_lazy('index')

    def get_success_url(self):
        return self.success_url


class MRegistrationView(CreateView):
    model = User
    template_name = "registration.html"
    form_class = RegisterUserForm
    success_url = reverse_lazy('index')
    success_msg = 'User created'

    def form_valid(self, form):
        form_valid = super().form_valid(form)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        auth_user = authenticate(username=username, password=password)
        login(self.request, auth_user)
        user = User.objects.get(username=username)
        figure = Figure.objects.get(name="Peasant")
        Money.objects.create(master=user)
        FigureLink.objects.create(master=user, figure=figure, x=0, y=0, landed=True)
        FigureLink.objects.create(master=user, figure=figure, x=0, y=1, landed=True)
        return form_valid


class MLogoutView(LogoutView):
    next_page = reverse_lazy('index')


@require_http_methods(["GET"])
def friendsearch(request):
    founded_users = []
    founded_friends = []
    if request.user.is_authenticated:    
        for friendship in Friendship.objects.filter(Q(f_user=request.user) | Q(s_user=request.user)):
            if friendship.f_user == request.user:
                founded_friends.append(friendship.s_user)
            elif founded_friends.s_user == request.user:
                founded_friends.append(friendship.f_user)
        for user in User.objects.all():
            founded_users.append(user)
            for friend in founded_friends:
                if friend == user:
                    founded_users.pop()
    return render(request, 'friends.html', {'founded_users': founded_users, 'founded_friends': founded_friends})


@require_http_methods(["POST"])
def delete_friendship(request):
    if request.user.is_authenticated:
        if request.POST['friend']:
            user = User.objects.get(username=request.POST['friend'])
            Friendship.objects.filter(Q(f_user=user) | Q(s_user=user)).delete()
    return redirect('friends_searching_page')



def create_friendship(request):
    if request.user.is_authenticated and request.method == 'POST':
        Friendship.objects.create(f_user=request.user, s_user=User.objects.get(username=request.POST['username']))
    return redirect('friends_searching_page')


def shop(request):
    products = Figure.objects.all()
    money = Money.objects.get(master=request.user)
    return render(request, 'figureShop.html', {'products': products, 'money': money.money})


def buy_figure(request):
    if request.user.is_authenticated:
        figure = Figure.objects.get(name=request.POST['figure_name'])
        money = Money.objects.get(master=request.user)
        if money.money >= figure.price:
            money.money = money.money - figure.price
            money.save()
            FigureLink.objects.create(figure=figure, master=request.user)
    return redirect('shop')
