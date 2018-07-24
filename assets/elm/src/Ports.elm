port module Ports exposing (signMessage)

import Json.Encode as JE exposing (Value)
import Json.Decode as JD exposing (field)


port signMessage : (JE.Value -> msg) -> Sub msg

