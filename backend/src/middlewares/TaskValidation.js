const TaskModel = require('../models/TaskModel');
const { isPast } = require('date-fns');

const TaskValidation = async (req, res, next) => {
    const { macaddress, type, title, description, when } = req.body;

    if (!macaddress)
        return res.status(400).json({ error: 'Macaddress é Obrigatório'});
    else  if (!type)
        return res.status(400).json({ error: 'Tipo é Obrigatório'});
    else  if (!title)
        return res.status(400).json({ error: 'Título é Obrigatório'});
    else  if (!description)
        return res.status(400).json({ error: 'Descrição é Obrigatória'});
    else  if (!when)
        return res.status(400).json({ error: 'Data e Hora são Obrigatória'});
    
    else{
        let exists;

        if(req.params.id){
            exists = await TaskModel
                .findOne(
                { '_id': {'$ne': req.params.id},
                    'when': {'$eq': new Date(when)},
                    'macaddress': {'$in': macaddress}
                });
        } else {
			if(isPast(new Date(when)))
				return res.status(400).json({ error: 'Escolha Uma Data e Hora Futura'});
            exists = await TaskModel
                .findOne(
                { 
                    'when': {'$eq': new Date(when)},
                    'macaddress': {'$in': macaddress}
                });
        }

        if(exists){
            return res.status(400).json({ error: 'Já Existe Uma Tarefa Nesse Dia e Horário'});  
        }  

        next();
    }
}

module.exports = TaskValidation;