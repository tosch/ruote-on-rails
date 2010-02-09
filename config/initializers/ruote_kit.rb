RuoteKit.configure do |config|
  # make changes if needed
  #
  # config.work_directory = 'my_special_work_dir' # defaults to File.join( Dir.pwd, "work_#{RuoteKit.env}" )
  # config.workers = 2                            # defaults to 1
  # config.run_engine = false                     # defaults to true
  # config.run_worker = true                      # defaults to false
  # config.mode = :transient                      # defaults to :file_system
end

# Register participants if needed

# Register the catchall participant (named '.*') if needed
RuoteKit.configure_catchall!
