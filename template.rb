gem 'ruote', '~>2.1.11'
gem 'ruote-kit', '~>2.1.11'

environment <<-CODE
  # we don't put RuoteKit into the Rack middleware stack as we would duplicate
    # routing between Rails and RuoteKit (it's a Sinatra app). Instead, we use
    # Rails' routes.rb to pass requests on /_ruote(.*) to RuoteKit.
    #
    # config.middleware.use 'RuoteKit::Application'
CODE

rakefile 'ruote.rake', <<-CODE
  namespace :ruote do
    desc 'Run a worker thread for ruote'
    task :run_worker => :environment do
      RuoteKit.run_worker(RUOTE_STORAGE)
    end
  end
CODE

initializer 'ruote-kit.rb', <<-CODE
# make changes when needed
#
# you may use another persistent storage for example or include a worker so that
# you don't have to run it in a separate instance

require 'ruote/storage/fs_storage'

RUOTE_STORAGE = Ruote::FsStorage.new("ruote_work_\#{Rails.env}")

RuoteKit.engine = Ruote::Engine.new(RUOTE_STORAGE)
# By default, there is no running worker when you start the Rails server
# This is due to the fact that a the worker should be 'always on' and not all
# deployments may guarantee that. To start a worker in its own process, call
# rake ruote:run_worker
# If you like to have a worker running as soon as you start Rails, replace the
# line before this comment with the following line:
#
# RuoteKit.engine = Ruote::Engine.new(Ruote::Worker.new(RUOTE_STORAGE))

unless $RAKE_TASK # don't register participants in rake tasks
  RuoteKit.engine.register do
    # register your own participants using the participant method
    #
    # Example: participant 'alice', Ruote::StorageParticipant see
    # http://ruote.rubyforge.org/participants.html for more info

    # register the catchall storage participant named '.+'
    catchall
  end
end
CODE

route <<-CODE
# routes to RuoteKit
  match '/_ruote' => RuoteKit::Application
  match '/_ruote/*path' => RuoteKit::Application
CODE
