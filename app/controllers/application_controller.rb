
class ApplicationController < ActionController::Base

  protect_from_forgery

  before_filter :login_required

  layout 'application'

  protected # if it makes any sense

  def login_required

    return true if self.class == SessionsController
      # no login required for the login/logout screens

    return true if session[:username]

    redirect_to :controller => 'sessions', :action => 'new'
    false
  end
end
