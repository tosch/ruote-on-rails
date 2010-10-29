
#
# ruote process instances
#
class ProcessesController < ApplicationController

  def index

    @processes = RuoteKit.engine.processes
  end

  def create

    definition = Definition.find(params[:definition])

    wfid = RuoteKit.engine.launch(definition.definition)

    flash[:notice] = I18n.t('flash.notice.launched', :wfid => wfid)

    redirect_to :controller => 'definitions', :action => 'index'
  end
end

