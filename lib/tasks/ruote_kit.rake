namespace :ruote_kit do
  desc "Run a worker thread for RuoteKit"
  task :run_worker => :environment do
    RuoteKit.run_worker!
  end
end