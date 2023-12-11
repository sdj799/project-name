import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { AuthService } from './auth.service';
import { QrRequestDto, QrResponseDto } from './dto/qr-login.dto';
  
  @WebSocketGateway(8080)
  export class AuthGateway 
    implements OnGatewayConnection, OnGatewayDisconnect
  {

    constructor(private readonly AuthService: AuthService) {}

    @WebSocketServer()
    server: Server;

    private smartTVClients: Map<String, WebSocket> = new Map();
    // 웹소켓 연결시
    public handleConnection(client: WebSocket) {
      console.log('connected');
    }

    // 스마트 TV 인증코드전달
    @SubscribeMessage('addNewDevice')
    onEvent(client: WebSocket, data: QrRequestDto): void {
      // console.log(data);
      if (data.code) {
        let code = data.code;
        this.smartTVClients.set(code, client);
      }
      // console.log(this.smartTVClients);
    }

    // 모바일 앱 로그인 정보 전달
    @SubscribeMessage('/login/qr')
    onQRScan(client: WebSocket, data: QrResponseDto): any {
      console.log(data);
      let selectClient: WebSocket;
      
      for (const [key, value] of this.smartTVClients.entries()) {
        if (key == data.code) {
          selectClient = value;
          break;
        }
      }
      // console.log(selectClient);

      if(!selectClient) {
        return '다시 요청해주세요';
      }
      
      // 선택된 클라이언트로 data 보내기
      try {
        selectClient.send(JSON.stringify(data));
      } catch (error) {
        console.log(error);
      }
      return "로그인 성공";
    }

    // 웹소켓 연결 해제시
    public handleDisconnect(client: WebSocket) {
      // console.log('disconnetced', client);
      // 웹소켓으로 code찾아서 리스트에서 삭제
      for (const [key, value] of this.smartTVClients.entries()) {
        if (value === client) {
          this.smartTVClients.delete(key);
          break;
        }
      }
      // console.log(this.smartTVClients);
    }
  }