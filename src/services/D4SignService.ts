import { Request, Response } from "express";
import request from "request";
import prisma from "../database/prisma";

require("dotenv/config");

// Buscando todos os documentos da conta do d4sign
export const listarDocumentos = (req: Request, res: Response): void => {
  const options = {
    method: "GET",
    url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,
    headers: {
      Accept: "application/json",
    },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    res.send(response.body);
  });
};

// Cadastra UMA assinatura por documento
// Parametros recebidos:
// email:  (obrigatório)	E-mail do signatário (pessoa que precisa assinar o documento)
// act: (obrigatório)	Ação da assinatura.
// 	Ações permitidas:
// 	1 = Assinar
// 	2 = Aprovar
// 	3 = Reconhecer
// 	4 = Assinar como parte
// 	5 = Assinar como testemunha
// 	6 = Assinar como interveniente
// 	7 = Acusar recebimento
// 	8 = Assinar como Emissor, Endossante e Avalista
// 	9 = Assinar como Emissor, Endossante, Avalista, Fiador
// 	10 = Assinar como fiador
// 	11 = Assinar como parte e fiador
// 	12 = Assinar como responsável solidário
// 	13 = Assinar como parte e responsável solidário
// foreign: (obrigatório)	Indica se o signatário é estrangeiro, ou seja, se possui CPF.
// 	0 = Possui CPF (Brasileiro).
// 	1 = Não possui CPF (Estrangeiro).
// 	Para os signatários definidos como 'estrangeiros', o CPF não será exigido.
// foreign_lang:	Indica qual idioma será utilizado para o estrangeiro.
// 	en = Inglês (US)
// 	es = Espanhol
// 	ptBR = Português
// certificadoicpbr: (obrigatório)	Indica se o signatário DEVE efetuar a assinatura com um Certificado Digital ICP-Brasil.
// 	0 = Será efetuada a assinatura padrão da D4Sign.
// 	1 = Será efetuada a assinatura com um Certificado Digital ICP-Brasil.
// assinatura_presencial: (obrigatório)	Indica se o signatário DEVE efetuar a assinatura de forma presencial.
// 	1 = Será efetuada a assinatura presencial.
// 	0 = Não será efetuada a assinatura presencial.
// docauth: (opcional)	Indica se o signatário DEVE efetuar a assinatura apresentando um documento com foto.
// 	1 = Será efetuada a assinatura exigindo um documento com foto.
// 	0 = Não será efetuada a assinatura exigindo um documento com foto.
// docauthandselfie: (opcional)	Indica se o signatário DEVE efetuar a assinatura apresentando um documento com foto e depois registrar uma selfie segurando o mesmo documento.
// 	1 = Será efetuada a assinatura exigindo um documento com foto e uma selfie segurando o documento.
// 	0 = Não será efetuada a assinatura exigindo um documento com foto e uma selfie segurando o documento.
// embed_methodauth: (opcional)	Indica qual o método de autenticação será utilizado no EMBED.
// 	email = O token será enviado por e-mail
// 	password = Caso o signatário já possua uma conta D4Sign, será exigida a senha da conta.
// 	sms = O token será enviado por SMS (para utilizar essa opção entre em contato com a equipe comercial da D4Sign)
// 	whats = O token será enviado por WhatsApp (para utilizar essa opção entre em contato com a equipe comercial da D4Sign)
// embed_smsnumber: (opcional)	Indica o número de telefone que será enviado o TOKEN.
// 	Atenção: esse número deverá seguir o padrão E.164.
// 	Ex.: +5511953020202 (código do país, DDD, número do telefone)
// upload_allow: (opcional)	Indica se o signatário poderá enviar outros documentos
// upload_obs: (opcional)	Se o upload_allow for setado como 1, indique aqui quais documentos o signatário deve enviar

// Função para cadastrar uma assinatura no documento
export const cadastrarAssinaturaNoDocumento = (
  req: Request,
  res: Response
): void => {
  const {
    id_document,
    email,
    act,
    foreign,
    certificadoicpbr,
    assinatura_presencial,
    docauth,
    docauthandselfie,
    embed_methodauth,
    embed_smsnumber,
    upload_allow,
    upload_obs,
  } = req.body;

  const options = {
    method: "POST",
    url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents/${id_document}/createlist?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,

    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: {
      signers: [
        {
          email: email,
          act: act,
          foreign: foreign,
          certificadoicpbr: certificadoicpbr,
          assinatura_presencial: assinatura_presencial,
          docauth: docauth,
          docauthandselfie: docauthandselfie,
          embed_methodauth: embed_methodauth,
          embed_smsnumber: embed_smsnumber,
          upload_allow: upload_allow,
          upload_obs: upload_obs,
        },
      ],
    },
    json: true,
  };

  request(options, (error, response, body) => {
    if (error) {
      res.status(500).json({ message: "Erro ao buscar documento", error });
      return;
    }

    if (response.statusCode !== 200) {
      res
        .status(response.statusCode)
        .json({ message: "Erro ao buscar documento", body });
      return;
    }

    try {
      const contract = JSON.parse(body);
      res.status(200).json({ contract, message: "E-mail Cadastrado!" });
    } catch (parseError) {
      res
        .status(500)
        .json({
          message: "Erro ao processar resposta do D4Sign",
          error: parseError,
        });
    }
  });
};

//Enviar documentos para assinatura dos envolvidos
//Parametros recebidos:
// message:
//        Mensagem que será enviada para os signatários, caso o parâmetro skip_email esteja definido como 0
// skip_email:
//        Opções:
//        0 = Os signatários serão avisados por e-mail que precisam assinar um documento.
//        1 = O e-mail não será disparado.
//        ATENÇÃO: Nos casos em que o EMBED ou a ASSINATURA PRESENCIAL estiver sendo usado, ou seja, quando o signatário for efetuar a assinatura diretamente do seu website ou em seu Tablet, o parâmetro skip_email DEVERÁ ser definido como 1
// workflow:
//        Opções:
//        0 = Para não seguir o workflow.
//        1 = Para seguir o workflow.
//        Caso o parâmetro workflow seja definido como 1, o segundo signatário só receberá a mensagem de que há um documento aguardando sua assinatura DEPOIS que o primeiro signatário efetuar a assinatura, e assim sucessivamente.
//        Porém, caso seja definido como 0, todos os signatários poderão assinar o documento ao mesmo tempo.

// Função para enviar um documento para assinar
export const enviarDocumentoParaAssinar = (
  req: Request,
  res: Response
): void => {
  const { id_document, message, skip_email, workflow } = req.body;
  

  const options = {
    method: "POST",
    url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents/${id_document}/sendtosigner?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,

    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: {
      message: message,
      skip_email: skip_email,
      workflow: workflow,
    },
    json: true,
  };
  

  request(options, (error, response, body) => {
    if (error) {
      console.error("Erro na requisição:", error);
      res.status(500).json({error,  message: "Erro ao enviar documento para assinatura" });
      return;
    }

    try {
      res.status(200).json({ body, message: "Contrato enviado para assinar!" });
    } catch (parseError) {
      console.error("Erro ao processar resposta:", parseError);
      res.status(500).json({ message: "Erro ao processar resposta do D4Sign", error: parseError });
    }
  });
};

// Cadastrar documento no D4Sign
// Parametros recebidos:
// base64_binary_file: (obrigatório)	Arquivo que será enviado para os servidores da D4Sign. ATENÇÃO: Você deve enviar o binário do seu arquivo codificado em BASE64
// mime_type: (obrigatório)	Informe o MIMETYPE do seu arquivo
// name: (obrigatório)	Informe o nome do seu arquivo

// Função para cadastrar um documento
export const cadastrarDocumento = (req: Request, res: Response): void => {
  const { name, file, contractId } = req.body;

  const contractInt = parseInt(contractId);

  try {

    const base64File = file.replace(/^data:application\/pdf;base64,/, '');
    const fileBuffer = Buffer.from(base64File, 'base64');

    if (fileBuffer.length > 50 * 1024 * 1024) {
      res.status(413).json({ message: "File size exceeds limit" });
      return;
    }

    const options = {
      method: "POST",
      url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents/${process.env.ID_COFRE}/uploadbinary?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: {
        base64_binary_file: base64File,
        mime_type: "application/pdf",
        name: name,
      },
      json: true,
    };

    request(options, async (error, response, body) => {
      if (error) throw new Error(error);

      const id_doc = body.uuid;
      const message = body.message;

      if(message === 'This account has no more limits to send documents'){
        res.status(403).json({ message: "Limite de envio de documentos excedido." });
        return;
      }

      try {
        await prisma.contracts.update({
          where: {
            id: contractInt,
          },
          data: {
            d4sign: id_doc,
          },
        });
        return res.status(200).json({
          message: "Documento cadastrado com sucesso",
          d4sign: id_doc,
        });
      } catch (dbError) {
        console.error("Erro ao atualizar o contrato no banco:", dbError);
        return res.status(500).json({
          message: "Erro ao atualizar o contrato no banco",
          error: dbError,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Internal Error", error });
  }
};

export const cadastrarAditivo = (req: Request, res: Response): void => {
  const { name, file, contractId } = req.body;

  const contractInt = parseInt(contractId);

  try {

    const base64File = file.replace(/^data:application\/pdf;base64,/, '');
    const fileBuffer = Buffer.from(base64File, 'base64');

    if (fileBuffer.length > 50 * 1024 * 1024) {
      res.status(413).json({ message: "Tamanho do arquivo excedeu o limite." });
      return;
    }

    const options = {
      method: "POST",
      url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents/${process.env.ID_COFRE}/uploadbinary?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: {
        base64_binary_file: base64File,
        mime_type: "application/pdf",
        name: name,
      },
      json: true,
    };

    request(options, async (error, response, body) => {
      if (error) throw new Error(error);

      const id_doc = body.uuid; 
      const message = body.message;

      if(message === 'This account has no more limits to send documents'){
        res.status(403).json({ message: "Limite de envio de documentos excedido." });
        return;
      }

      try {
        await prisma.additive.update({
          where: {
            id: contractInt,
          },
          data: {
            d4sign: id_doc,
          },
        });
        return res.status(200).json({
          message: "Aditivo cadastrado com sucesso",
          d4sign: id_doc,
        });
      } catch (dbError) {
        console.error("Erro ao atualizar o aditivo no banco:", dbError);
        return res.status(500).json({
          message: "Erro ao atualizar o aditivo no banco",
          error: dbError,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Internal Error", error });
  }
};

// Cancelar Documentos no D4Sign
// Parametros recebidos:
// comment: (opcional)	Insira um comentário sobre o cancelamento.

// Função para cancelar um documento
export const cancelarDocumento = (req: Request, res: Response): void => {
  const { id_doc, comment } = req.body;

  const options = {
    method: "POST",
    url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents/${id_doc}/cancel?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,

    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: { comment: comment },
    json: true,
  };

  request(options, async (error, response, body) => {
    try {
      const contract = JSON.parse(body.statusName);
      
      await prisma.contracts.update({
        where: {
          d4sign: id_doc,
        },
        data: {
          d4sign: null,
        },
      });
      
      res
        .status(200)
        .json({
          contract,
          message: "Documento cancelado e referência removida do contrato!",
        });
    } catch (parseError) {
      await prisma.contracts.update({
        where: {
          d4sign: id_doc,
        },
        data: {
          d4sign: null,
        },
      });

      res
        .status(500)
        .json({
          message: "Erro ao processar resposta do D4Sign",
          error: parseError,
        });
    }
  });
};

export const cancelarAditivo = (req: Request, res: Response): void => {
  const { id_doc, comment } = req.body;

  const options = {
    method: "POST",
    url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents/${id_doc}/cancel?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,

    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: { comment: comment },
    json: true,
  };

  request(options, async (error, response, body) => {
    try {
      const contract = JSON.parse(body.statusName);
      
      await prisma.additive.update({
        where: {
          d4sign: id_doc,
        },
        data: {
          d4sign: null,
        },
      });
      
      res
        .status(200)
        .json({
          contract,
          message: "Documento cancelado e referência removida do aditivo!",
        });
    } catch (parseError) {
      await prisma.additive.update({
        where: {
          d4sign: id_doc,
        },
        data: {
          d4sign: null,
        },
      });

      res
        .status(500)
        .json({
          message: "Erro ao processar resposta do D4Sign",
          error: parseError,
        });
    }
  });
};

// Buscar Documentos de um cofre ou pasta especifica no D4Sign

// Função para buscar documentos do cofre
export const buscarDocumentosDoCofre = (req: Request, res: Response): void => {
  const options = {
    method: "GET",
    url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents/${process.env.ID_COFRE}/safe?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,

    headers: { Accept: "application/json" },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    res.send(body);
  });
};

// Função para buscar documentos do cofre
export const buscarDocumentosDoCofreAditivo = (req: Request, res: Response): void => {
  const options = {
    method: "GET",
    url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents/${process.env.ID_COFRE}/safe/${process.env.ID_PASTA_ADITIVO}?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,

    headers: { Accept: "application/json" },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    res.send(body);
  });
};

export const buscarDocumentosDoCofrePorId = (
  req: Request,
  res: Response
): void => {
  const documentId = req.query.documentId as string;

  const options = {
    method: "GET",
    url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents/${documentId}?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,

    headers: { Accept: "application/json" },
  };

  request(options, (error, response, body) => {
    if (error) {
      res.status(500).json({ message: "Erro ao buscar documento", error });
      return;
    }

    if (response.statusCode !== 200) {
      res
        .status(response.statusCode)
        .json({ message: "Erro ao buscar documento", body });
      return;
    }

    try {
      const contract = JSON.parse(body);
      res.status(200).json({ contract, message: "Contrato localizado!" });
    } catch (parseError) {
      res
        .status(500)
        .json({
          message: "Erro ao processar resposta do D4Sign",
          error: parseError,
        });
    }
  });
};


// Download de um documento especifico
// Parametros recebidos:
// type: (opcional)	Para realizar o download do arquivo completo, escolha ZIP nesse atributo. Para realizar o download apenas do PDF, escolha PDF nesse atributo.
// language: (opcional)	Para realizar o download do arquivo em inglês, escolha en nesse atributo. Para realizar o download do arquivo em português, escolha pt nesse atributo.

// Função para fazer o download de um documento
export const downloadDeDocumento = (req: Request, res: Response): void => {
  const { id_doc } = req.body;
  

  const options = {
    method: "POST",
    url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents/${id_doc}/download?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,

    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: { type: "PDF", language: "pt" },
    json: true,
  };

  request(options, (error, response, body) => {
    if (error) {
      res.status(500).json({ message: "Erro ao buscar documento", error });
      return;
    }

    if (response.statusCode !== 200) {
      res
        .status(response.statusCode)
        .json({ message: "Erro ao buscar documento", body });
      return;
    }

    try {
      const contract = typeof body === "string" ? JSON.parse(body) : body;
      res.status(200).json({ contract, message: "Signatarios localizados!" });
    } catch (parseError) {
      res
        .status(500)
        .json({
          message: "Erro ao processar resposta do D4Sign",
          error: parseError,
        });
    }
  });
};

// Lista de assinaturas de um documento especifico
// Parametros recebidos:
// id_doc: (Obrigatorio) id do documento que vai ser listado os signatarios

// Função para listar signatários de um documento
export const listarSignatariosDeDocumento = (
  req: Request,
  res: Response
): void => {
  const documentId = req.query.documentId as string;

  const options = {
    method: "GET",
    url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents/${documentId}/list?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,

    headers: { Accept: "application/json" },
  };

  request(options, (error, response, body) => {
    if (error) {
      res.status(500).json({ message: "Erro ao buscar documento", error });
      return;
    }

    if (response.statusCode !== 200) {
      res
        .status(response.statusCode)
        .json({ message: "Erro ao buscar documento", body });
      return;
    }

    try {
      const contract = JSON.parse(body);
      res.status(200).json({ contract, message: "Signatarios localizados!" });
    } catch (parseError) {
      res
        .status(500)
        .json({
          message: "Erro ao processar resposta do D4Sign",
          error: parseError,
        });
    }
  });
};

// Remover signatarios de documento
// Parametros Recebidos:
// email-signer: (obrigatório)	E-mail do signatário
// key-signer: (obrigatório)	Chave do signatário

// Função para remover assinatura do documento
export const removerAssinaturaDoDocumento = (
  req: Request,
  res: Response
): void => {
  const { id_doc, id_assinatura, email_assinatura } = req.body;

  const options = {
    method: "POST",
    url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents/${id_doc}/removeemaillist?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,

    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: { "key-signer": id_assinatura, "email-signer": email_assinatura },
    json: true,
  };

  request(options, (error, response, body) => {
    if (error) {
      res.status(500).json({ message: "Erro ao buscar documento", error });
      return;
    }

    if (response.statusCode !== 200) {
      res
        .status(response.statusCode)
        .json({ message: "Erro ao buscar documento", body });
      return;
    }

    try {
      const contract = JSON.parse(body);
      res.status(200).json({ contract, message: "Assinatura removida!" });
    } catch (parseError) {
      res
        .status(500)
        .json({
          message: "Erro ao processar resposta do D4Sign",
          error: parseError,
        });
    }
  });
};

// Lista todos os docunemtos de uma fase
// Parametros recebidos
//ID-FASE (obrigatório)	ID da FASE que deverá ser listado.
//	ID 1 - Processando
//	ID 2 - Aguardando Signatários
//	ID 3 - Aguardando Assinaturas
//	ID 4 - Finalizado
//	ID 5 - Arquivado
//	ID 6 - Cancelado
//	ID 7 - Editando

// Função para listar o status do documento
export const listaDocumentoStatus = (req: Request, res: Response): void => {
  const { id_fase } = req.body;

  const options = {
    method: "GET",
    url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents/${id_fase}/status?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,

    headers: { Accept: "application/json" },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    res.send(body);
  });
};

//Reenviar documento para signatarios assinar

// Função para reenviar documento para os signatários assinarem
export const reenviarDocumentoParaAssinar = (
  req: Request,
  res: Response
): void => {
  const { email, id_doc } = req.body;

  const options = {
    method: "POST",
    url: `https://${process.env.D4SIGN_AMBIENTE_TESTE}.d4sign.com.br/api/v1/documents/${id_doc}/resend?tokenAPI=${process.env.D4SIGN_API_TOKEN}&cryptKey=${process.env.D4SIGN_CRYPT_KEY}`,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: { email: email },
    json: true,
  };

  request(options, (error, response, body) => {
    try {
      const contract = JSON.parse(body);
      res.status(200).json({ contract, message: "Email reenviado!" });
    } catch (parseError) {
      res
        .status(500)
        .json({
          message: "Erro ao processar resposta do D4Sign",
          error: parseError,
        });
    }
  });
};
