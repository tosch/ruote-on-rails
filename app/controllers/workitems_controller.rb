
#
# ruote workitems
#
class WorkitemsController < ApplicationController

  def index

    @workitems = Ruote::Workitem.for_user(session[:username])
  end

  def show

    @workitem =
      RuoteKit.storage_participant[params[:id]]
    @tree =
      Rufus::Json.encode(RuoteKit.engine.process(@workitem.wfid).current_tree)
    @form =
      Form.for(@workitem)
  end

  def update

    fields = Rufus::Json.decode(params[:workitem][:fields])

    workitem = RuoteKit.storage_participant[params[:id]]
    workitem.fields.merge!(fields)

    submit = params[:workitem][:submit]

    if submit == 'proceed'
      RuoteKit.storage_participant.reply(workitem)
      flash[:notice] = I18n.t('flash.proceeded', :wfid => workitem.fei.wfid)
    else
      if submit == 'release'
        workitem.participant_name = 'anyone'
      elsif submit == 'take'
        workitem.participant_name = session[:username]
      end
      RuoteKit.storage_participant.update(workitem)
    end

    redirect_to :action => :index
  end
end

