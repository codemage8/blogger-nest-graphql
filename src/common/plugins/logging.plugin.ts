import {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestContextWillSendResponse,
  GraphQLRequestListener,
} from '@apollo/server'
import { Plugin } from '@nestjs/apollo'

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  async requestDidStart(
    context: GraphQLRequestContext<unknown>
  ): Promise<GraphQLRequestListener<any>> {
    console.log('LoggingPlugin::Request started: operationName: ', context.request.operationName)
    return {
      async willSendResponse(requestContext: GraphQLRequestContextWillSendResponse<unknown>) {
        console.log('LoggingPlugin::Will send response: ', requestContext.response.body)
        console.log(requestContext.response.body)
      },
    }
  }

  async unexpectedErrorProcessingRequest({
    requestContext,
    error,
  }: {
    requestContext: GraphQLRequestContext<unknown>
    error: Error
  }) {
    console.log(
      'LoggingPlugin::UnexpectedErrorProcessingRequest: ',
      requestContext.request.operationName,
      error
    )
  }

  async invalidRequestWasReceived({ error }: { error: Error }) {
    console.log('LoggingPlugin::InvalidRequestWasReceived: ', error)
  }
}
