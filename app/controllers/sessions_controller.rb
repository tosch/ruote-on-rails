
#
# dummy session/login management
#
class SessionsController < ApplicationController

  def new

    # simply letting app/sessions/new.haml get shown
  end

  def create

    if u = User.authentify(params[:username], params[:password])
      session[:username] = params[:username]
      session[:locale] = u.locale
      redirect_to '/'
    else
      flash[:error] = I18n.t('flash.errors.login_failed')
      render :action => :new
    end
  end

  def destroy

    session.delete(:username)
      # logging out

    render :action => :new
  end
end

