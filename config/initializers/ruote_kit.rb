# make changes when needed
#
# you may use another persistent storage for example or include a worker so that
# you don't have to run it in a separate instance

require 'ruote/storage/fs_storage'

RUOTE_STORAGE = Ruote::FsStorage.new("ruote_work_#{Rails.env}")

RuoteKit.engine = Ruote::Engine.new(RUOTE_STORAGE)

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