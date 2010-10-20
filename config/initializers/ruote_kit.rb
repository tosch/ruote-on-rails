# make changes when needed
#
# you may use another persistent storage for example or include a worker so that
# you don't have to run it in a separate instance

# we will use yajl for json encoding/decoding
# you may whish to use another one (json, json_pure) if yajl is not available
require 'yajl'
Rufus::Json.backend = :yajl

require 'ruote/storage/fs_storage'

RUOTE_STORAGE = Ruote::FsStorage.new("ruote_work_#{Rails.env}")

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

# when true, the engine will be very noisy (stdout)
#
RuoteKit.engine.context.logger.noisy = false

require Rails.root.join('app/models/workitem.rb')
