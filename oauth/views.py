from allauth.socialaccount.models import SocialAccount
from django.views import View
from django.shortcuts import render, redirect

from member.models import Member, MemberProfile
from member.serializers import MemberSerializer


class OAuthLoginView(View):
    def get(self, request):
        user = SocialAccount.objects.get(user=request.user)
        oauth_data = user.extra_data
        member_type = user.provider
        if member_type == "kakao":
            member_email = oauth_data.get("kakao_account").get("email")
            member_name = oauth_data.get("properties").get("nickname")
            member_profile = oauth_data.get("properties").get("profile_image")
        else:
            member_email = oauth_data.get("email")
            member_name = oauth_data.get("name")
            member_profile = oauth_data.get("picture")

        member_data = {
            'member_email': member_email,
            'member_type': member_type
        }
        is_member = Member.objects.filter(**member_data)

        path = '/'
        if not is_member.exists():
            path = f'/member/join?member_email={member_email}&member_name={member_name}&member_profile={member_profile}&member_type={member_type}'
        else:
            member = is_member.first()
            request.session['member'] = MemberSerializer(member).data
            member_files = list(member.memberprofile_set.values('file_url'))
            if len(member_files) != 0:
                request.session['member_files'] = member_files

            previous_uri = request.session.get('previous_uri')

            if previous_uri is not None:
                path = previous_uri
                del request.session['previous_uri']

        return redirect(path)
