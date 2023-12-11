export class QrRequestDto {
  code: string;
  terminalKey: string;
}

export class QrResponseDto {
  memberId: string;
  memberPw: string;
  code: string;
  terminalKey: string;
}