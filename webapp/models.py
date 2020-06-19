from django.db import models

# Create your models here.


class Friendship(models.Model):
    f_user = models.ForeignKey('auth.User', related_name="f_user", on_delete=models.CASCADE)
    s_user = models.ForeignKey('auth.User', related_name="s_user", on_delete=models.CASCADE)

    def __str__(self):
    	return "Friendship between %s and %s" % (self.f_user.username, self.s_user.username)


class Money(models.Model):
    master = models.OneToOneField('auth.User', on_delete=models.CASCADE, primary_key=True)
    money = models.IntegerField(default=0)

    def __str__(self):
    	return self.master.username
