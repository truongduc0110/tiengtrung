import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateVocabularySetDto } from './create-vocabulary-set.dto';

export class UpdateVocabularySetDto extends PartialType(
    OmitType(CreateVocabularySetDto, ['classId'] as const),
) { }
