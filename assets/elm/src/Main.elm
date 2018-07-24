module Main exposing (..)

import Html exposing (Html, Attribute, ul, li, text)
import Ports exposing (signMessage)

import Json.Encode as JE exposing (Value)
import Json.Decode as JD exposing (field)


main : Program Never Model Msg
main =
  Html.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


-- MODEL

type alias Model =
  { messages : List String
  }

init : (Model, Cmd Msg)
init =
  (Model [], Cmd.none)


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  signMessage decodeSignMessage


-- UPDATE

type Msg
  = ReceiveViewerMessage String
  | NoOp

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    ReceiveViewerMessage string ->
      ( { model | messages = model.messages ++ [string] }, Cmd.none )

    NoOp ->
      ( model, Cmd.none )


-- VIEW

view : Model -> Html Msg
view model =
  ul [] (List.map makeLi model.messages)


makeLi : String -> Html Msg
makeLi msg =
  li [] [text msg]


-- HELPERS

decodeSignMessage : JE.Value -> Msg
decodeSignMessage msg =
  case JD.decodeValue JD.string msg of
    Ok string -> ReceiveViewerMessage string
    Err _ -> NoOp
