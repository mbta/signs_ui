defmodule SignsUI.Mock.AwsRequest do
  def request(put_object) do
    {:ok, put_object}
  end
end
