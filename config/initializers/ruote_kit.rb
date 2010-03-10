RuoteKit.configure do |config|
  # make changes if needed
  #
  # config.work_directory = 'my_special_work_dir' # defaults to File.join( Dir.pwd, "work_#{RuoteKit.env}" )
  # config.workers = 2                            # defaults to 1
  # config.run_worker = true                      # defaults to false
  # config.mode = :transient                      # defaults to :file_system

  config.register do
    # register your own participants using the participant method
    #
    # Example:
    # participant 'alice', Ruote::StorageParticipant

    # register the catchall storage participant named '.+'
    catchall
  end
end