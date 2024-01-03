package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.TransactionRecord;
import com.SYNTIARO_POS_SYSTEM.Repository.TransactionRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class TransactionRecordService {

    @Autowired
    TransactionRecordRepository transactionRecordRepository;

    public List<TransactionRecord> getTransactioneByStoreId(Integer store_id) {
        return transactionRecordRepository.findByStoreid(store_id);
    }
}
