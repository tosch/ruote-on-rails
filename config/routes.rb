
RuoteOnRails::Application.routes.draw do

  resources :workitems
  resources :processes
  resources :forms

  # ruote-kit
  #
  match '/_ruote' => RuoteKit::Application
  match '/_ruote/*path' => RuoteKit::Application

  # login / logout
  #
  resources :sessions
  match 'login' => 'sessions#new'
  match 'logout' => 'sessions#destroy'

  # /
  #
  root :to => 'workitems#index'
end

