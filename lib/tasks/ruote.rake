namespace :ruote do
  desc "Run a worker thread for RuoteKit"
  task :run_worker => :environment do
    RuoteKit.run_worker(RUOTE_STORAGE)
  end
end